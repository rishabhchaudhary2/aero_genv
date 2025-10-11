import ContactMini from '../components/ContactMini.tsx';
import Nav from '../components/Nav';
import Transition from '../components/Transition';

const Contact = () => {


    return (
        <>
            <Nav />
            <ContactMini />
        </>
    );
};

export default Transition(Contact);
