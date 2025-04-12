import { NextFunction, Request, Response } from "express";
import AppDataSource from "../../config/ormconfig";
import { Kontragent } from "../../entities/kontragent.entity";
import { In, IsNull } from "typeorm";
import { CustomError } from "../../error-handling/error-handling";
const kontragentRepository = AppDataSource.getRepository(Kontragent);

export const createKontragent = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
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
            relations: ["user"],
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

        if (ownershipForm !== undefined) {
            kontragent.ownershipForm = ownershipForm;
        }
        if (inn !== undefined) {
            kontragent.inn = inn;
        }
        if (pinfl !== undefined) {
            kontragent.pinfl = pinfl;
        }
        if (oked !== undefined) {
            kontragent.oked = oked;
        }
        if (name !== undefined) {
            kontragent.name = name; 
        }
        if (legalAddress !== undefined) {
            kontragent.legalAddress = legalAddress;
        }
        if (countryOfRegistration !== undefined) {
            kontragent.countryOfRegistration = countryOfRegistration;
        }

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
