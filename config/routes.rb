Rails.application.routes.draw do
  resources :drawings
  devise_for :users
  resources :users


  get '/' => 'ellie_dee#index'
  get '/index' => 'ellie_dee#index'
  get '/users/:id' => 'users#show'
  get '/featured' => 'drawings#featured'
  get '/submissions' => 'drawings#submissions'

  root to: 'ellie_dee#index'
end
