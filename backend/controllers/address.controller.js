import Address from "../models/address.model.js";

export const createAddress = async (req, res) => {
    try {
        const address = await Address.create({
            ...req.body,
            userId: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Address saved successfully",
            address,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Address save failed",
            error: error.message,
        });
    }
};

export const getMyAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ userId: req.user._id }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            addresses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Address fetch failed",
            error: error.message,
        });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const address = await Address.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user._id,
            },
            req.body,
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Address updated successfully",
            address,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Address update failed",
            error: error.message,
        });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Address deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Address delete failed",
            error: error.message,
        });
    }
};