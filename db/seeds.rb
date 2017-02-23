admin = User.create({ email: 'admin@admin.com', password: 'admin123', password_confirmation: 'admin123' })
admin.add_role :admin
admin.remove_role :reader

ctrl = User.create({ email: 'ctrl@ctrl.com', password: 'ctrl123', password_confirmation: 'ctrl123' })
ctrl.add_role :ctrl
ctrl.remove_role :reader

reader = User.create({ email: 'reader@reader.com', password: 'reader123', password_confirmation: 'reader123' })

ellieDee = Drawing.create({ name: 'EllieDee', leds: [], user_id: admin.id })
