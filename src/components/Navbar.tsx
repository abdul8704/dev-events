import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
    return (
        <header>
            <nav>
                <Link href ='/public' className="logo">
                    <Image src="/icons/logo.png" alt = "logo" width={24} height={24}/>
                    <p>DevEvent</p>
                </Link>

                <ul>
                    <Link href='/' >Home</Link>
                    <Link href='/'>Create Event</Link>
                    <Link href='/'></Link>
                </ul>
            </nav>
        </header>
    )
}
export default Navbar
