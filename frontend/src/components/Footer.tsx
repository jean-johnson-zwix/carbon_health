import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    emiscope: [
      { label: 'About Us', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Contact', href: '#' }
    ],
    product: [
      { label: 'Carbon Calculator', href: '#' },
      { label: 'AI Insights', href: '#' },
      { label: 'Reports', href: '#' },
      { label: 'API', href: '#' }
    ],
    methodology: [
      { label: 'Emission Factors', href: '#' },
      { label: 'Data Sources', href: '#' },
      { label: 'Calculations', href: '#' },
      { label: 'Standards', href: '#' }
    ],
    contact: [
      { label: 'Support', href: '#' },
      { label: 'Partnerships', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Careers', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' }
  ];

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Emiscope */}
          <div>
            <h3 className="font-sora font-bold text-lg mb-4 text-primary">Emiscope</h3>
            <ul className="space-y-3">
              {footerLinks.emiscope.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Methodology */}
          <div>
            <h3 className="font-semibold mb-4">Methodology</h3>
            <ul className="space-y-3">
              {footerLinks.methodology.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 mb-6">
              {footerLinks.contact.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2024 Emiscope. All rights reserved.
          </div>
          <div className="text-sm text-muted-foreground">
            Built with 🌱 for a sustainable future
          </div>
        </div>
      </div>
    </footer>
  );
}