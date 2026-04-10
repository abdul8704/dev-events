"use server";

import Booking from "@/src/models/booking.model";
import connectDB from "@/src/lib/db";
import ServiceResponse from "@/src/types/index";

export const createBooking = async ({
    eventId,
    slug,
    email,
}: {
    eventId: string;
    slug: string;
    email: string;
}): Promise<ServiceResponse> => {
    try {
        await connectDB();
        const exists = await Booking.findOne({ eventId, email });

        if (exists) {
            return {
                success: false,
                message: "Already booked",
            };
        }

        await Booking.create({ eventId, slug, email });

        return {
            success: true,
            message: "Booking created successfully",
        };
    }
    catch (err) {
        console.log(err);
        return {
            success: false,
            message: "Booking creation failed",
        };
    }
};
