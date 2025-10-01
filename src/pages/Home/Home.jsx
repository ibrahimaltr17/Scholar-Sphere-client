import React from 'react';
import Banner from '../../components/Banner/Banner';
import TopScholarships from '../../components/TopScholarships/TopScholarships';
import FAQSection from '../../components/FAQSection/FAQSection';
import HowToApply from '../../components/HowToApply/HowToApply';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <TopScholarships></TopScholarships>
            <HowToApply></HowToApply>
            <FAQSection></FAQSection>
        </div>
    );
};

export default Home;