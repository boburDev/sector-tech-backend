import { NextFunction, Request, Response } from "express";
import AppDataSource from "../../config/ormconfig";
import { Kontragent } from "../../entities/kontragent.entity";
import { In, IsNull, Like, Not } from "typeorm";
import { CustomError } from "../../error-handling/error-handling";
import { KontragentAddress } from "../../entities/kontragent_addresses.entity";
const kontragentRepository = AppDataSource.getRepository(Kontragent);
const kontragentAddressRepository = AppDataSource.getRepository(KontragentAddress);

export const createKontragent = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { ownershipForm, inn, pinfl, oked, name, legalAddress, isFavorite, countryOfRegistration } = req.body;
        const userId = req.user.id;

        if (!ownershipForm) throw new CustomError('ownershipForm is required', 400);
        if (ownershipForm === "Индивидуальный предприниматель" && !pinfl) throw new CustomError('pinfl is required for Индивидуальный предприниматель', 400);
        if (
            (ownershipForm === "Юридическое лицо" ||
                ownershipForm === "Юридическое лицо, обособленное подразделение") &&
            !inn
        ) throw new CustomError('inn is required for Юридическое лицо', 400);

        let existingCondition: any = { userId, deletedAt: IsNull() };
        if (ownershipForm === "Индивидуальный предприниматель") {
            existingCondition.pinfl = pinfl;
        } else {
            existingCondition.inn = inn;
        }
        if (existingCondition.inn || existingCondition.pinfl) {
            const existingKontragent = await kontragentRepository.findOne({ where: existingCondition });
            if (existingKontragent) throw new CustomError('Kontragent with this INN/PINFL already exists for this user', 400);
        }

        await AppDataSource.transaction(async (manager) => {
            if (isFavorite) {
                await manager.update(
                    Kontragent,
                    { userId, isFavorite: true, deletedAt: IsNull() },
                    { isFavorite: false }
                );
            }

            const kontragent = manager.create(Kontragent, {
                ownershipForm,
                inn,
                pinfl,
                oked,
                name,
                legalAddress,
                isFavorite,
                userId,
                countryOfRegistration
            });

            await manager.save(kontragent);

            return res.status(201).json({
                message: "Kontragent successfully created",
                data: kontragent,
                error: null,
                status: 201
            });
        });
    } catch (error) {
        next(error);
    }
};

export const getKontragents = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const userId = req.user.id;
        const kontragents = await kontragentRepository.find({
            where: { userId, deletedAt: IsNull() },
            relations: ["user", "address"],
            order: {
                createdAt: "DESC",
                address: {
                    createdAt: "DESC"
                }
            },
            select: {
                id: true,
                ownershipForm: true,
                inn: true,
                pinfl: true,
                oked: true,
                name: true,
                legalAddress: true,
                isFavorite: true,
                countryOfRegistration: true,
                user: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true
                },
                address: {
                    id: true,
                    fullAddress: true,
                    country: true,
                    region: true,
                    district: true,
                    street: true,
                    house: true,
                    apartment: true,
                    index: true,
                    comment: true,
                    isMain: true,
                    createdAt: true,
                }
            }
        });

        const user_kontragents = await kontragentRepository.find({
            where: {
                inn: In(kontragents.map((kontragent) => kontragent.inn !== null ? kontragent.inn : ""))
            },
            select: {
                inn: true,
                name: true,
            }
        })

        return res.status(200).json({
            message: "Kontragents successfully received",
            data: { kontragents, user_kontragents },
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const updateKontragent = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const {
            ownershipForm,
            inn,
            pinfl,
            oked,
            name,
            legalAddress,
            isFavorite,
            countryOfRegistration
        } = req.body;

        const userId = req.user.id;

        const kontragent = await kontragentRepository.findOne({ where: { id, userId, deletedAt: IsNull() } });
        if (!kontragent) throw new CustomError('Kontragent not found', 404);

        const newOwnershipForm = ownershipForm ?? kontragent.ownershipForm;

        if (newOwnershipForm === "Индивидуальный предприниматель" && (pinfl ?? kontragent.pinfl) === undefined) {
            throw new CustomError('pinfl is required for Индивидуальный предприниматель', 400);
        }

        if (
            (newOwnershipForm === "Юридическое лицо" || newOwnershipForm === "Юридическое лицо, обособленное подразделение") &&
            (inn ?? kontragent.inn) === undefined
        ) {
            throw new CustomError('inn is required for Юридическое лицо', 400);
        }

        if (inn) {
            const exists = await kontragentRepository.findOne({
                where: { inn, userId, deletedAt: IsNull(), id: Not(id) }
            });
            if (exists) throw new CustomError('Another kontragent with this INN already exists', 400);
        }

        if (pinfl) {
            const exists = await kontragentRepository.findOne({
                where: { pinfl, userId, deletedAt: IsNull(), id: Not(id) }
            });
            if (exists) throw new CustomError('Another kontragent with this PINFL already exists', 400);
        }

        if (ownershipForm !== undefined) kontragent.ownershipForm = ownershipForm;
        if (inn !== undefined) kontragent.inn = inn;
        if (pinfl !== undefined) kontragent.pinfl = pinfl;
        if (oked !== undefined) kontragent.oked = oked;
        if (name !== undefined) kontragent.name = name;
        if (legalAddress !== undefined) kontragent.legalAddress = legalAddress;
        if (countryOfRegistration !== undefined) kontragent.countryOfRegistration = countryOfRegistration;

        if (isFavorite !== undefined) {
            if (isFavorite === true) {
                await AppDataSource.transaction(async (manager) => {
                    await manager.update(
                        Kontragent,
                        { userId, isFavorite: true, deletedAt: IsNull() },
                        { isFavorite: false }
                    );

                    kontragent.isFavorite = true;
                    await manager.save(kontragent);
                });
            } else {
                kontragent.isFavorite = false;
                await kontragentRepository.save(kontragent);
            }
        } else {
            await kontragentRepository.save(kontragent);
        }

        return res.status(200).json({
            message: "Kontragent successfully updated",
            data: kontragent,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const deleteKontragent = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const kontragent = await kontragentRepository.findOne({ where: { id, userId, deletedAt: IsNull() } });

        if (!kontragent) throw new CustomError('Kontragent not found', 404);
        
        kontragent.deletedAt = new Date();
        await kontragentRepository.save(kontragent);
        return res.status(200).json({
            message: "Kontragent successfully deleted",
            data: null,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const createKontragentAddress = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { kontragentId } = req.params;
        const userId = req.user.id;
        const { fullAddress, country, region, district, street, house, apartment, index, comment, isMain } = req.body;

        const kontragent = await kontragentRepository.findOne({ where: { id: kontragentId, userId, deletedAt: IsNull() } });
        if (!kontragent) throw new CustomError('Kontragent not found', 404);

        const existingKontragentAddress = await kontragentAddressRepository.findOne({ where: { fullAddress, deletedAt: IsNull() } });
        if (existingKontragentAddress) throw new CustomError('Kontragent address already exists', 400);

        await AppDataSource.transaction(async (manager) => {
            if (isMain) {
                await manager.update(
                    KontragentAddress,
                    { kontragentId, isMain: true, deletedAt: IsNull() },
                    { isMain: false }
                );
            }
            const kontragentAddress = manager.create(KontragentAddress, {
                kontragentId,
                fullAddress,
                country,
                region,
                district,
                street,
                house,
                apartment,
                index,
                comment,
                isMain
            });

            await manager.save(kontragentAddress);

            return res.status(201).json({
                message: "Kontragent address successfully created",
                data: kontragentAddress,
                error: null,
                status: 201
            });
        });
    } catch (error) {
        next(error);
    }
};

export const updateKontragentAddress = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const { fullAddress, country, region, district, street, house, apartment, index, comment, isMain } = req.body;
        const kontragentAddress = await kontragentAddressRepository.findOne({ where: { id, deletedAt: IsNull() } });
        if (!kontragentAddress) throw new CustomError('Kontragent address not found', 404);

        kontragentAddress.fullAddress = fullAddress ?? kontragentAddress.fullAddress;
        kontragentAddress.country = country ?? kontragentAddress.country;
        kontragentAddress.region = region ?? kontragentAddress.region;
        kontragentAddress.district = district ?? kontragentAddress.district;
        kontragentAddress.street = street ?? kontragentAddress.street;
        kontragentAddress.house = house ?? kontragentAddress.house;
        kontragentAddress.apartment = apartment ?? kontragentAddress.apartment;
        kontragentAddress.index = index ?? kontragentAddress.index;
        kontragentAddress.comment = comment ?? kontragentAddress.comment;
        if (isMain !== undefined) {
            if (isMain === true) {
                await AppDataSource.transaction(async (manager) => {
                    await manager.update(
                        KontragentAddress,
                        { kontragentId: kontragentAddress.kontragentId, isMain: true, deletedAt: IsNull() },
                        { isMain: false }
                    );

                    kontragentAddress.isMain = true;
                    await manager.save(kontragentAddress);
                });
            } else {
                kontragentAddress.isMain = false;
                await kontragentAddressRepository.save(kontragentAddress);
            }
        } else {
            await kontragentAddressRepository.save(kontragentAddress);
        }

        return res.status(200).json({
            message: "Kontragent address successfully updated",
            data: kontragentAddress,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const deleteKontragentAddress = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const kontragentAddress = await kontragentAddressRepository.findOne({ where: { id, deletedAt: IsNull() } });

        if (!kontragentAddress) throw new CustomError('Kontragent address not found', 404);

        kontragentAddress.deletedAt = new Date();
        await kontragentAddressRepository.save(kontragentAddress);
        return res.status(200).json({
            message: "Kontragent address successfully deleted",
            data: null,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const getKontragentByInn = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { inn, name } = req.query;
        const userId = req.user.id;

        if (!inn) throw new CustomError('inn is required', 400);
        let whereCondition: any = { inn: Like(`%${inn}%`), userId, deletedAt: IsNull() };
        if (name) {
            whereCondition.name = Like(`%${name}%`);
        }
        const kontragent = await kontragentRepository.findOne({ where: whereCondition });
        if (!kontragent) throw new CustomError('Kontragent not found', 404);

        return res.status(200).json({
            message: "Kontragent successfully received",
            data: kontragent,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};