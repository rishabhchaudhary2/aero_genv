'use client';

import Nav from '../components/Nav';
// import ImageTrail from '../components/ImageTrail';
import Header from '../components/Header';
import Showcase from '../components/Showcase';
import BestGlasses from '../components/BestGlasses';

// import Transition from '../components/Transition';
import Collections from '../components/Collections';
import Footer from '../components/Footer'
const Home = () => {
    return (
        <>
            {/* Video Section */}
            <Nav />
            <div className="h-screen w-full bg-[#e5e5dd] relative">
                <div className="h-full w-full overflow-hidden">
                    <Header />
                    {/* <ImageTrail
                        items={[
                            '/galleryimages/1.jpg',
                            '/galleryimages/2.jpg',
                            '/galleryimages/3.jpg',
                            '/galleryimages/4.jpg',
                            '/galleryimages/5.jpg',
                            '/galleryimages/6.jpg',
                            '/galleryimages/7.jpg',
                            '/galleryimages/8.jpg',
                            '/galleryimages/9.jpg',
                            '/galleryimages/10.jpg',
                            '/galleryimages/11.jpg',
                        ]}
                        variant={1}
                    /> */}
                </div>
            </div>
            {/* <div className="font-final">
                <Showcase />
            </div> */}
            <BestGlasses />
            {/* <Text /> */}
            <Collections />
            <Footer />
        </>
    );
};

export default Home;
// export default Transition(Home);