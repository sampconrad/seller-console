import { Github, Globe, Linkedin } from 'lucide-react';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className='bg-gray-600 mt-auto'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0'>
          <div className='text-sm text-white'>
            Developed by <span className='font-medium text-white'>Sampconrad</span>
          </div>
          <div className='flex space-x-4'>
            <a
              href='https://www.sampconrad.com/'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center text-sm text-white hover:text-gray-300 transition-colors'>
              <Globe className='w-4 h-4 mr-1' />
              Portfolio
            </a>
            <a
              href='https://github.com/sampconrad'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center text-sm text-white hover:text-gray-300 transition-colors'>
              <Github className='w-4 h-4 mr-1' />
              GitHub
            </a>
            <a
              href='https://www.linkedin.com/in/sampconrad/'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center text-sm text-white hover:text-gray-300 transition-colors'>
              <Linkedin className='w-4 h-4 mr-1' />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
