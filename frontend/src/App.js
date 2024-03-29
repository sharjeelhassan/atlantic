import socketIOClient from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { signout } from './actions/userActions';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import SigninScreen from './screens/SigninScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import SellerRoute from './components/SellerRoute';
import SellerScreen from './screens/SellerScreen';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import { useEffect, useState } from 'react';
import { listProductCategories } from './actions/productActions';
import LoadingBox from './components/LoadingBox';
import MessageBox from './components/MessageBox';
import MapScreen from './screens/MapScreen';
import DashboardScreen from './screens/DashboardScreen';
import KPIScreen from './screens/KPIScreen';
import SupportScreen from './screens/SupportScreen';
import ChatBox from './components/ChatBox';
import useGeoLocation from './hooks/useGeoLocation';
import TrackerScreen from './screens/TrackerScreen';

const ENDPOINT =
  window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:5000'
    : window.location.host;

const App = () => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  // GPS Location Emit
  /*********************************************/
  const [socket, setSocket] = useState(null);
  const location = useGeoLocation();
  /*********************************************/

  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  };

  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategoryList;

  useEffect(() => {
    dispatch(listProductCategories());
    if (!socket) {
      const sk = socketIOClient(ENDPOINT);
      setSocket(sk);
    } else if(socket && userInfo && !userInfo.isAdmin) {
      socket.emit('gpsCoordsFromUser', {
        gpsInfo: location,
        userInfo: {
          _id: userInfo._id,
          name: userInfo.name,
          isAdmin: userInfo.isAdmin,
        },
      });
    }
  }, [dispatch, location, socket, userInfo]);

  return (
    <BrowserRouter>
      <div className='grid-container'>
        <header className='row'>
          <div>
            <button
              className='openSidebar'
              type='button'
              onClick={() => setSidebarIsOpen(true)}
            >
              <i className='fa fa-bars'></i>
            </button>
            <Link className='brand' to='/'>
              amazon.com
            </Link>
          </div>
          <div>
            <Route
              render={({ history }) => (
                <SearchBox history={history}></SearchBox>
              )}
            ></Route>
          </div>
          <div>
            <Link to='/cart'>
              Cart
              {cartItems.length > 0 && (
                <span className='badge'>{cartItems.length}</span>
              )}
            </Link>
            {userInfo ? (
              <div className='dropdown'>
                <Link to='#'>
                  {userInfo.name} <i className='fa fa-caret-down'></i>
                </Link>
                <ul className='dropdown-content'>
                  <li>
                    <Link to='/profile'>User Profile</Link>
                  </li>
                  <li>
                    <Link to='/orderhistory'>Order History</Link>
                  </li>
                  <li>
                    <Link to='#signout' onClick={signoutHandler}>
                      Sign Out
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to='/signin'>Sign In</Link>
            )}
            {userInfo && userInfo.isSeller && (
              <div className='dropdown'>
                <Link to='#seller'>
                  Seller <i className='fa fa-caret-down'></i>
                </Link>
                <ul className='dropdown-content'>
                  <li>
                    <Link to='/productlist/seller'>Products</Link>
                  </li>
                  <li>
                    <Link to='/orderlist/seller'>Orders</Link>
                  </li>
                </ul>
              </div>
            )}
            {userInfo && userInfo.isAdmin && (
              <div className='dropdown'>
                <Link to='#admin'>
                  Admin <i className='fa fa-caret-down'></i>
                </Link>
                <ul className='dropdown-content'>
                  <li>
                    <Link to='/dashboard'>Dashboard</Link>
                  </li>
                  <li>
                    <Link to='/kpi'>KPI</Link>
                  </li>
                  <li>
                    <Link to='/tracker'>Tracker</Link>
                  </li>
                  <li>
                    <Link to='/productlist'>Products</Link>
                  </li>
                  <li>
                    <Link to='/orderlist'>Orders</Link>
                  </li>
                  <li>
                    <Link to='/userlist'>Users</Link>
                  </li>
                  <li>
                    <Link to='/support'>Support</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>
        <aside className={sidebarIsOpen ? 'open' : ''}>
          <ul className='categories'>
            <li>
              <strong>Categories</strong>
              <button
                className='close-sidebar'
                type='button'
                onClick={() => setSidebarIsOpen(false)}
              >
                <i className='fa fa-close'></i>
              </button>
            </li>
            {loadingCategories ? (
              <LoadingBox></LoadingBox>
            ) : errorCategories ? (
              <MessageBox variant='danger'>{errorCategories}</MessageBox>
            ) : (
              categories.map((c) => (
                <li key={c}>
                  <Link
                    to={`/search/category/${c}`}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    {c}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </aside>
        <main>
          <Route path='/' component={HomeScreen} exact></Route>
          <Route path='/register' component={RegisterScreen}></Route>
          <Route path='/signin' component={SigninScreen}></Route>
          <Route path='/product/:id' component={ProductScreen} exact></Route>
          <Route
            path='/product/:id/edit'
            component={ProductEditScreen}
            exact
          ></Route>
          <Route path='/cart/:id?' component={CartScreen}></Route>
          <Route path='/shipping' component={ShippingAddressScreen}></Route>
          <Route path='/payment' component={PaymentMethodScreen}></Route>
          <Route path='/placeorder' component={PlaceOrderScreen}></Route>
          <Route path='/order/:id' component={OrderScreen}></Route>
          <Route path='/orderhistory' component={OrderHistoryScreen}></Route>
          <Route
            path='/search/name/:name?'
            component={SearchScreen}
            exact
          ></Route>
          <Route
            path='/search/category/:category'
            component={SearchScreen}
            exact
          ></Route>
          <Route
            path='/search/category/:category/name/:name'
            component={SearchScreen}
            exact
          ></Route>
          <Route
            path='/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber'
            component={SearchScreen}
            exact
          ></Route>
          <PrivateRoute
            path='/profile'
            component={ProfileScreen}
          ></PrivateRoute>
          <PrivateRoute path='/map' component={MapScreen}></PrivateRoute>
          <AdminRoute
            path='/productlist'
            component={ProductListScreen}
            exact
          ></AdminRoute>
          <AdminRoute
            path='/productlist/pageNumber/:pageNumber'
            component={ProductListScreen}
            exact
          ></AdminRoute>
          <AdminRoute
            path='/orderlist'
            component={OrderListScreen}
            exact
          ></AdminRoute>
          <AdminRoute path='/userlist' component={UserListScreen}></AdminRoute>
          <AdminRoute
            path='/user/:id/edit'
            component={UserEditScreen}
          ></AdminRoute>
          <AdminRoute
            path='/dashboard'
            component={DashboardScreen}
          ></AdminRoute>
          <AdminRoute path='/kpi' component={KPIScreen}></AdminRoute>
          <AdminRoute path='/tracker' component={TrackerScreen}></AdminRoute>
          <AdminRoute path='/support' component={SupportScreen}></AdminRoute>
          <SellerRoute
            path='/productlist/seller'
            component={ProductListScreen}
          ></SellerRoute>
          <SellerRoute
            path='/orderlist/seller'
            component={OrderListScreen}
          ></SellerRoute>
          <Route path='/seller/:id' component={SellerScreen}></Route>
        </main>
        <footer className='row center'>
          {location.loaded
            ? JSON.stringify(location)
            : 'Location data not available'}{' '}
          <br />
          {userInfo && !userInfo.isAdmin && <ChatBox userInfo={userInfo} />}
          <div>All right reserved</div>{' '}
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
