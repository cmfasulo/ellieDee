Rails.application.routes.draw do
  resources :drawings
  devise_for :users, :controllers => { registrations: 'registrations' }
  # resources :users


  get '/' => 'ellie_dee#index'
  get '/index' => 'ellie_dee#index'
  get '/users/:id' => 'users#show'
  get '/featured' => 'drawings#featured'
  get '/submissions' => 'drawings#submissions'
  get '/about' => 'ellie_dee#about'
  get '/contact' => 'contact#index'
  get '/elliedee' => 'drawings#elliedee'

  root to: 'ellie_dee#index'
end
