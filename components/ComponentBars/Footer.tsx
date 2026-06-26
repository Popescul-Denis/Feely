import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  return (
    <div className="footer_container">
      <footer className="footer">
        <p className="footer_text">
          &copy; {new Date().getFullYear()} Feely. All rights reserved.
        </p>
      </footer>
      <div className="social">
        <Link href="https://www.facebook.com/profile.php?id=100051629433086" target="_blank"><Image src="/icons/Facebook.png" width={30} height={30} alt="Facebook"/></Link>
        <Link href="https://www.instagram.com/popescu4709/" target="_blank"><Image src="/icons/instagram.png" width={30} height={30} alt='Instagram'/></Link>
        <Link href="https://www.linkedin.com/in/denis-popescu-91b363386/" target="_blank"><Image src="/icons/LinkedIN.png" width={30} height={30} alt='LinkedIn'/></Link>
      </div>
    </div>
  )
}

export default Footer