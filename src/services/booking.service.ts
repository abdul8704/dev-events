import Booking from "@/src/models/booking.model";
import ServiceResponse from "@/src/types/index";


const bookEvent = async (eventId: string, email: string): Promise<ServiceResponse> => {
    try {
        const exists = await Booking.findOne({ where: { id: eventId, email } });

        if(exists){
            return {
                success: false,
                message: "Already Booked for this event"
            };
        }

        await Booking.create({eventId: eventId, email: email});

        return {
            success: true,
            message: "Successfully Booked for this event"
        };
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

export default bookEvent;