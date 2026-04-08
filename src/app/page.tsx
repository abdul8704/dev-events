import ExploreBtn from "@/src/componenets/ExploreBtn";
import EventCardt from "@/src/componenets/EventCard";
import EventCard from "@/src/componenets/EventCard";
import events from "@/src/lib/constants"

const Page = () => {
    return (
        <section className="mt-12">
            <h1 className="text-center">The Hub for Every Dev <br/> Event You Can't Miss</h1>
            <p className="text-center mt-5">Hackathons, Meetups and Conferences, All in one place</p>
            <center className="mt-4"> <ExploreBtn /> </center>

            <div className="px-18 mt-20 space-y-7" id="events">
                <h3>Featured Events</h3>

                <ul className="events">
                    {events.map((event) => (
                        <li key={event.title}>
                            <EventCard {...event} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
export default Page
