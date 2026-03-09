import { Link } from 'react-router-dom';

const footerLinks = {
  Product: [
    { label: 'Features', path: '/features' },
    { label: 'Live Demo', path: '/demo' },
    { label: 'Downloads', path: '/downloads' },
    { label: 'SLD Generator', path: '/generate' },
  ],
  Resources: [
    { label: 'Documentation', path: '/docs' },
    { label: 'Installation Guide', path: 'https://github.com/chatgptnotes/GridVision/blob/main/docs/installation-guide.md' },
    { label: 'API Reference', path: 'https://github.com/chatgptnotes/GridVision/blob/main/docs/api-reference.md' },
    { label: 'Protocol Guide', path: 'https://github.com/chatgptnotes/GridVision/blob/main/docs/protocol-guide.md' },
  ],
  Company: [
    { label: 'About', path: '/contact' },
    { label: 'Contact', path: '/contact' },
    { label: 'GitHub', path: 'https://github.com/chatgptnotes/GridVision' },
  ],
};

export default function PublicFooter() {
  return (
    <footer className="bg-[#1B3054] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/gridvision-logo.jpg" alt="GridVision" className="h-10 w-10 rounded object-cover" />
              <span className="text-lg font-bold">
                <span className="text-[#2DB8C4]">Grid</span>
                <span className="text-white">Vision</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Next-generation SCADA platform for smart distribution substation monitoring and control.
            </p>
            <p className="text-xs mt-3 text-gray-500">
              Smart Distribution Initiative
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold text-sm mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.path.startsWith('http') ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-[#2DB8C4] transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.path} className="text-sm hover:text-[#2DB8C4] transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs">&copy; {new Date().getFullYear()} GridVision SCADA. All rights reserved.</p>
          <p className="text-xs text-gray-400">
            <a href="https://drmhope.com" className="hover:text-[#2DB8C4] transition-colors">drmhope.com</a> | A Bettroi Product
          </p>
        </div>
      </div>
    </footer>
  );
}