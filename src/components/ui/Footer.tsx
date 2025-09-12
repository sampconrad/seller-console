/**
 * Reusable footer component
 */

import { Github, Globe, Linkedin } from 'lucide-react';
import React from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <div className={`border-t border-gray-200 p-6 ${className}`}>
      <div className='text-center space-y-3'>
        <div className='text-xs text-gray-500'>
          Developed by <span className='font-medium text-gray-700'>Sampconrad</span>
        </div>
        <div className='flex justify-center space-x-4'>
          <a
            href='https://www.sampconrad.com/'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors'>
            <Globe className='w-3 h-3 mr-1' />
            Portfolio
          </a>
          <a
            href='https://github.com/sampconrad'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors'>
            <Github className='w-3 h-3 mr-1' />
            GitHub
          </a>
          <a
            href='https://www.linkedin.com/in/sampconrad/'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors'>
            <Linkedin className='w-3 h-3 mr-1' />
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
