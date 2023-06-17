import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './components/home/HomePage';
import DefaultHeader from './components/containers/default/DefaultHeader';
import CategoryCreatePage from './components/containers/category/create/CategoryCreatePage';
import {Route, Routes } from 'react-router-dom';
import DefaultLayout from './components/containers/default/DefaultLayout';
import CategoryEditPage from './components/containers/category/edit/CategoryEditPage';
import LoginPage from './components/auth/login/LoginPage';
import RegisterPage from './components/auth/register/RegisterPage';
import ProductCreatePage from './components/containers/product/create/ProductCreatePage';
function App() {
  return (
    <>
      <DefaultHeader/>
      <Routes>
        <Route path='/' element = {<DefaultLayout/>}>
          <Route index element = {<HomePage/>}/>
          <Route path='categories/create' element={<CategoryCreatePage/>}/>
          <Route path='categories/edit' element={<CategoryEditPage/>}/>
          <Route path='login' element={<LoginPage/>}/>
          <Route path='register' element={<RegisterPage/>}/>
          <Route path='products/create' element={<ProductCreatePage/>}/>
        </Route>
      </Routes>
      
      
    </>
  );
}

export default App;
