import './assets/scss/theme.scss';

import { ReactComponent as MultiversXLogo } from 'assets/img/logo-full.svg';

export const App = () => {
  return (
    <div className='d-flex'>
      <main className='main-content'>
        <header className='header'>
          <div className='logo-wrapper'>
            <a
              className='logo'
              aria-label='MultiversX Explorer'
              data-testid=''
              href='/'
            >
              <MultiversXLogo />
            </a>
          </div>
        </header>
        <div className='main-content-container d-flex flex-column'>
          <div className='container'>
            <div className='hero-home card card-lg card-black'>
              <div
                className='particles static-bg'
                id='canvas-container'
                style={{
                  backgroundImage: 'url("assets/img/three/static-bg.png")'
                }}
              ></div>
              <div className='card-body d-flex flex-column justify-content-between'>
                <h1 className='h2 mb-4 font-headings title'>
                  MultiversX Blockchain Explorer
                </h1>
                <div className='col-lg-6 m-auto'>
                  <div className='card card-black'>
                    <div className='card-body p-5 text-center'>
                      <h2 className='h2 mb-0 font-headings title'>
                        Under Maintenance
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='page-container' data-testid='mainPageContent'>
            <div className='home page-content container'></div>
          </div>
        </div>
        <footer className='footer d-flex flex-column align-items-center justify-content-center text-muted pt-2'>
          <div className='footer-inner'>
            <a
              rel='noopener noreferrer nofollow'
              target='_blank'
              className='d-flex align-items-center text-neutral-400'
              href='https://multiversx.com/'
            >
              Made with
              <svg
                aria-hidden='true'
                focusable='false'
                data-prefix='fas'
                data-icon='heart'
                className='svg-inline--fa fa-heart text-danger mx-1'
                role='img'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 512 512'
                width='1rem'
              >
                <path
                  fill='currentColor'
                  d='M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z'
                ></path>
              </svg>
              by the MultiversX team
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};
