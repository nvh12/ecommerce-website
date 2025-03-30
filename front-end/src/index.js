import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'

//redux
import { Provider } from 'react-redux'

// Stripe
import { Elements } from '@stripe/react-stripe-js'


//App
import App from './app'




ReactDOM.render(
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <Suspense fallback="...">
          <App />
        </Suspense>
      </Elements>
    </Provider>,
    document.getElementById('root'),
)