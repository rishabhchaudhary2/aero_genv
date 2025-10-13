'use client';

import Nav from '../components/Nav';
// import ImageTrail from '../components/ImageTrail';
import Header from '../components/Header';
import Showcase from '../components/Showcase';
import BestGlasses from '../components/BestGlasses';
import Text from '../components/Text';
// import Transition from '../components/Transition';
import Collections from '../components/Collections';
import ContactMini from '../components/ContactMini';

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
                            "https://res.cloudinary.com/djczgyd7j/image/upload/v1753443887/3_gg4bgj.jpg",
                            "https://res.cloudinary.com/djczgyd7j/image/upload/v1753443892/6_r4ldh0.jpg",
                            "https://res.cloudinary.com/djczgyd7j/image/upload/v1753443892/5_pagbhu.jpg",
                            "https://res.cloudinary.com/djczgyd7j/image/upload/v1753443886/1_ih9h6m.jpg",
                            "https://res.cloudinary.com/djczgyd7j/image/upload/v1753443888/2_d1rkl5.jpg",
                            "https://res.cloudinary.com/djczgyd7j/image/upload/v1753443889/4_aetzc8.jpg",
                            "https://res.cloudinary.com/djczgyd7j/image/upload/v1753443892/7_nimkdb.jpg",
                            "https://res.cloudinary.com/djczgyd7j/image/upload/v1753443889/8_qg90su.jpg",
                            "https://res.cloudinary.com/djczgyd7j/image/upload/v1753443890/9_bkyy1h.webp",
                            "https://res.cloudinary.com/djczgyd7j/image/upload/v1753443886/1_ih9h6m.jpg",
                        ]}
                        variant={1}
                    /> */}
                </div>
            </div>
            <div className="font-final">
                <Showcase />
            </div>
            <BestGlasses />
            <Text />
            <Collections />
            <ContactMini isHome={true} />
        </>
    );
};

export default Home;
// export default Transition(Home);