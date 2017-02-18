Rails.application.routes.draw do
  resources :drawings
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get "/" => "ellie_dee#index"
  get "/index" => "ellie_dee#index"

  root to: "ellie_dee#index"
end
