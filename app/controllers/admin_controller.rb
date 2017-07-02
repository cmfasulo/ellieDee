class AdminController < ApplicationController
  before_filter :authenticate_user!
  before_filter do
    redirect_to new_user_session_path unless current_user && (current_user.has_role? :admin)
  end

  def index
    @users = User.order(:id)
    @roles = Role.all
  end
end
