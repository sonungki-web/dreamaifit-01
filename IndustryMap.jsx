import React, { useState } from 'react';
import styled from 'styled-components';

const IndustryMap = () => {
  const [openCategories, setOpenCategories] = useState({});

  const toggleCategory = (categoryId) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  return (
    <Container>
      <Title>대한민국산업지도</Title>
      
      <CategorySection>
        <MainCategory onClick={() => toggleCategory('energy')}>
          에너지
          <ToggleIcon isOpen={openCategories.energy}>▼</ToggleIcon>
        </MainCategory>

        {openCategories.energy && (
          <SubCategories>
            <SubCategory>
              <CategoryButton>전기/가스/난방에너지</CategoryButton>
            </SubCategory>
            <SubCategory>
              <CategoryButton>전기인프라</CategoryButton>
            </SubCategory>
            <SubCategory>
              <CategoryButton onClick={() => toggleCategory('eco')}>
                친환경에너지
                <ToggleIcon isOpen={openCategories.eco}>▼</ToggleIcon>
              </CategoryButton>
              {openCategories.eco && (
                <DetailCategories>
                  <DetailCategory>바이오</DetailCategory>
                  <DetailCategory>수소</DetailCategory>
                  <DetailCategory>태양광</DetailCategory>
                  <DetailCategory>풍력</DetailCategory>
                </DetailCategories>
              )}
            </SubCategory>
          </SubCategories>
        )}
      </CategorySection>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
`;

const CategorySection = styled.div`
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
`;

const MainCategory = styled.div`
  background-color: #ff6b00;
  color: white;
  padding: 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SubCategories = styled.div`
  background-color: #fff4eb;
`;

const SubCategory = styled.div`
  border-bottom: 1px solid #ffe4d1;
`;

const CategoryButton = styled.button`
  width: 100%;
  padding: 12px 15px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #ffe4d1;
  }
`;

const DetailCategories = styled.div`
  padding-left: 20px;
  background-color: #fff8f3;
`;

const DetailCategory = styled.div`
  padding: 10px 15px;
  cursor: pointer;

  &:hover {
    background-color: #ffe4d1;
  }
`;

const ToggleIcon = styled.span`
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.3s ease;
`;

export default IndustryMap; 