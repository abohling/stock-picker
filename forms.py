from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, SelectField
from wtforms.validators import DataRequired, Email, Length


class UserAddForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[Length(min=6)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    user_image = StringField('(Optional) Image URL')


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[Length(min=6)])


class FavoriteStocks(FlaskForm):
    symbol = StringField('Symbol', validators=[DataRequired()])
    stock_name = StringField('Name', validators=[DataRequired()])


class NewStockForFavoriteList(FlaskForm):
    """Form for adding a song to playlist."""

    stock = SelectField('Stock To Add', coerce=int)
