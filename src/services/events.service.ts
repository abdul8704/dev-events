import Event from "@/src/models/event.model";

const getAllEvents = async () => {
    try{
        const events = await Event.find();
        return events;
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

const getEventById = async (id: string) => {

}

const createEvent = async (id: string) => {

}
const updateEvent = async (id: string) => {

}


const deleteEvent = async (id: string) => {

}

export default {
    getAllEvents,
    getEventById,
    updateEvent,
    createEvent,
    deleteEvent,
}