import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-white mb-4">About Us</h3>
            <p className="text-sm mb-4">
              Your trusted source for quality computer components and parts at competitive prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-500">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-500">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-500">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-white mb-4">Products</h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link to="/products?category=cpu" className="hover:text-primary-500">
                  CPUs
                </Link>
              </li>
              <li>
                <Link to="/products?category=gpu" className="hover:text-primary-500">
                  Graphics Cards
                </Link>
              </li>
              <li>
                <Link to="/products?category=memory" className="hover:text-primary-500">
                  Memory
                </Link>
              </li>
              <li>
                <Link to="/products?category=storage" className="hover:text-primary-500">
                  Storage
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-white mb-4">Customer Service</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#" className="hover:text-primary-500">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">Contact</h3>
            <div className="text-sm space-y-3">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>support@computerparts.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1" />
                <span>Ho Chi Minh City, Vietnam</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2024 Computer Parts Store. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary-500">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary-500">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary-500">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
