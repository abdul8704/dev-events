import Link from "next/link";
import Image from "next/image";

interface Props{
    title: string;
    image: string;
    slug: string;
    date: string;
    time: string;
    location: string;
}
const EventCard = ({ title, image, slug, date, time, location }: Props) => {
    return (
        <Link href={`/event/${slug}`} id="event-card">
            <Image src={image} alt ={title} width={410} height={300} className="poster mb-2"/>

            <div className="flex flex-row gap-2">
                <Image src='/icons/pin.svg' alt="location" height={14} width={14}/>
                <p>{location}</p>
            </div>

            <p className="title">{title}</p>

            <div className="datetime">
                <div>
                    <Image src='/icons/calendar.svg' alt="date" height={14} width={14}/>
                    <p>{date}</p>
                </div>

                <div>
                    <Image src='/icons/clock.svg' alt="time" height={14} width={14}/>
                    <p>{time}</p>
                </div>
            </div>
        </Link>
    )
}
export default EventCard
