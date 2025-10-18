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
                            "/galleryimages/trail1.jpg",
                            "/galleryimages/trail2.jpg",
                            "/galleryimages/trail3.jpg",
                            "/galleryimages/trail4.jpg",
                            "/galleryimages/trail5.jpg",
                            "/galleryimages/trail6.jpg",
                            "/galleryimages/trail7.jpg",
                            "/galleryimages/trail8.jpg",
                            "/galleryimages/trail9.jpg",
                            "/galleryimages/trail1.jpg",
                        ]}
                        variant={1}
                    /> */}
                </div>
            </div>
            <div className="font-final">
                <Showcase />
            </div>
            <BestGlasses />
            {/* <Text /> */}
            <Collections />
            <Footer isHome={true} />
        </>
    );
};

export default Home;
// export default Transition(Home);