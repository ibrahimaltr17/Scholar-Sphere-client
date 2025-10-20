import React from 'react';
import Banner from '../../components/Banner/Banner';
import TopScholarships from '../../components/TopScholarships/TopScholarships';
import FAQSection from '../../components/FAQSection/FAQSection';
import HowToApply from '../../components/HowToApply/HowToApply';
import RecentScholarships from '../../components/RecentScholarships/RecentScholarships';
import SubscriptionPlans from '../../components/SubscriptionPlans/SubscriptionPlans';
import SuccessStories from '../../components/SuccessStories/SuccessStories';
import UpcomingDeadlines from '../../components/UpcomingDeadlines/UpcomingDeadlines';


const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <TopScholarships></TopScholarships>
            <RecentScholarships></RecentScholarships>
            <UpcomingDeadlines></UpcomingDeadlines>
            <HowToApply></HowToApply>
            <SuccessStories></SuccessStories>
            <SubscriptionPlans></SubscriptionPlans>
            <FAQSection></FAQSection>
        </div>
    );
};

export default Home;