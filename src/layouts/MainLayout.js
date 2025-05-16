import React from 'react';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  background-color: #003366;
  color: white;
  padding: 1rem 0;
  text-align: center;
  border-radius: 5px 5px 0 0;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.8rem;
`;

const Content = styled.main`
  background-color: #fff;
  padding: 2rem;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Footer = styled.footer`
  text-align: center;
  padding: 1rem 0;
  margin-top: 2rem;
  color: #666;
  font-size: 0.9rem;
`;

const MainLayout = ({ children, title = "TORT X MVA Lead Form" }) => {
  return (
    <LayoutContainer>
      <Header>
        <Title>{title}</Title>
      </Header>
      <Content>
        {children}
      </Content>
      <Footer>
        &copy; {new Date().getFullYear()} TORT X MVA System
      </Footer>
    </LayoutContainer>
  );
};

export default MainLayout; 