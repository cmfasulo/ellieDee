class Ability
  include CanCan::Ability

  def initialize(user)
    if user.nil?
      user = User.new
    end

    if user.has_role? :admin
      can :manage, :all
    elsif user.has_role? :ctrl
      can :read, :all
      can :manage, Drawing, user_id: user.id
      can [:read, :update], Drawing, name: "EllieDee"
    elsif user.has_role? :reader
      can :read, :all
      can :manage, Drawing, user_id: user.id
    else user.has_role? :guest
      can :read, :all
    end

  end

end
