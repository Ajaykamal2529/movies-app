import { FaGoogle, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import './index.css'
const Footer = () => (
  <div className='footer'>
    <div>
        <button className='google'><FaGoogle /></button>
        <button className='twitter'><FaTwitter /></button>
        <button className='instagram'><FaInstagram /></button>
        <button className='youtube'><FaYoutube /></button>
    </div>
        <p className='contact-us'>Contact us</p>
  </div>
)
export default Footer;
