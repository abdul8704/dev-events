import { Suspense } from "react";
import ExploreBtn from "@/src/components/ExploreBtn";
import EventCard from "@/src/components/EventCard";
import { IEvent } from "@/src/models/event.model"
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function FeaturedEvents() {
    const eventData = await fetch(`${BASE_URL}/api/events`);
    const { data } = await eventData.json();

    return (
        <ul className="events">
            {data && data.length > 0 && data.map((event: IEvent) => {
                return (
                    <li key={event.title}>
                        <EventCard {...event} />
                    </li>
                );
            })}
        </ul>
    );
}

const FeaturedEventsFallback = () => {
    return (
        <ul className="events">
            {Array.from({ length: 3 }).map((_, index) => (
                <li key={index} className="event-card-skeleton">
                    <div className="poster-skeleton" />
                    <div className="line-skeleton line-short" />
                    <div className="line-skeleton line-medium" />
                    <div className="line-row">
                        <div className="line-skeleton line-short" />
                        <div className="line-skeleton line-short" />
                    </div>
                </li>
            ))}
        </ul>
    );
};

const Page = () => {

    return (
        <section className="mt-12">
            <h1 className="text-center">The Hub for Every Dev <br/> Event You Can&apos;t Miss</h1>
            <p className="text-center mt-5">Hackathons, Meetups and Conferences, All in one place</p>
            <center className="mt-4"> <ExploreBtn /> </center>

            <div className="px-18 mt-20 space-y-7" id="events">
                <h3>Featured Events</h3>

                <Suspense fallback={<FeaturedEventsFallback />}>
                    <FeaturedEvents />
                </Suspense>
            </div>
        </section>
    )
}
export default Page
