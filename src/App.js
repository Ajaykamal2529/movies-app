import Home from './components/Home'
import Login from './components/Login'
import Popular from './components/Popular'
import Account from './components/Account'
import Search from './components/Search'
import MovieItemDetails from './components/MovieItemDetails'
import ProtectedRoute from './components/ProtectedRoute'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


const App = () => (
    <BrowserRouter basename='/movies-app'>
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route exact path='/' element={<ProtectedRoute element={Home} />} />
            <Route exact path='/popular' element={<ProtectedRoute element={Popular} />} />
            <Route exact path='/profile' element={<ProtectedRoute element={Account} />} />
            <Route exact path='/search' element={<ProtectedRoute element={Search} />} />
            <Route exact path='/movies/:id' element={<ProtectedRoute element={MovieItemDetails} />} />
        </Routes>
    </BrowserRouter>
)

export default App