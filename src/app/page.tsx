import ExploreBtn from "@/src/components/ExploreBtn";
import EventCard from "@/src/components/EventCard";
import { IEvent } from "@/src/models/event.model"
import {cacheLife} from "next/cache";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
    // 'use cache';
    // cacheLife('hours');
    const eventData = await fetch(`${BASE_URL}/api/events`);
    const { data } = await eventData.json();

    return (
        <section className="mt-12">
            <h1 className="text-center">The Hub for Every Dev <br/> Event You Can't Miss</h1>
            <p className="text-center mt-5">Hackathons, Meetups and Conferences, All in one place</p>
            <center className="mt-4"> <ExploreBtn /> </center>

            <div className="px-18 mt-20 space-y-7" id="events">
                <h3>Featured Events</h3>

                <ul className="events">
                    {data && data.length > 0 && data.map((event: IEvent) => {
                        return (
                            <li key={event.title}>
                                <EventCard {...event} />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    )
}
export default Page
