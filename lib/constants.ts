interface Event {
    title: string;
    image: string;
    slug: string;
    date: string;
    time: string;
    location: string;
}

const events: Event[] = [
    {
        title: "React India Conference 2026",
        image: "/images/event1.png",
        slug: "react-india-2026",
        date: "2026-02-14",
        time: "09:00 AM - 05:00 PM",
        location: "Bangalore, India"
    },
    {
        title: "AI & Machine Learning Summit",
        image: "/images/event2.png",
        slug: "ai-ml-summit-2026",
        date: "2026-03-05",
        time: "10:00 AM - 04:00 PM",
        location: "Hyderabad, India"
    },
    {
        title: "Full Stack Developer Meetup",
        image: "/images/event3.png",

        slug: "fullstack-dev-meetup",
        date: "2026-01-20",
        time: "06:00 PM - 08:30 PM",
        location: "Chennai, India"
    },
    {
        title: "Next.js Global Hackathon",
        image: "/images/event4.png",
        slug: "nextjs-global-hackathon",
        date: "2026-04-10",
        time: "08:00 AM - 08:00 PM",
        location: "Online"
    },
    {
        title: "DevOps & Cloud Expo",
        image: "/images/event5.png",

        slug: "devops-cloud-expo",
        date: "2026-05-18",
        time: "09:30 AM - 05:30 PM",
        location: "Mumbai, India"
    },
    {
        title: "Open Source Contributors Meetup",
        image: "/images/event6.png",

        slug: "open-source-meetup",
        date: "2026-02-28",
        time: "05:00 PM - 07:30 PM",
        location: "Pune, India"
    }
];

export default events;