import React from 'react';
import Banner from '../../components/Banner/Banner';
import TopScholarships from '../../components/TopScholarships/TopScholarships';
import FAQSection from '../../components/FAQSection/FAQSection';
import HowToApply from '../../components/HowToApply/HowToApply';
import TopRatedUniversities from '../../components/TopRatedUni/TopRatedUni';
import RecentScholarships from '../../components/RecentScholarships/RecentScholarships';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <TopScholarships></TopScholarships>
            <HowToApply></HowToApply>
            <TopRatedUniversities></TopRatedUniversities>
            <RecentScholarships></RecentScholarships>
            <FAQSection></FAQSection>
            
        </div>
    );
};

export default Home;