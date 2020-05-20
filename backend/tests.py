from django.test import TestCase
from django.contrib.auth.models import User
from .models import CheckIn


class ModelTestCase(TestCase):
    def setUp(self):
        """Create a dummy user account and some check-ins"""
        User.objects.create(
            id=0,
            email='dummy@example.com',
            username='dummy',
            password='password',
            first_name='Dumm',
            last_name='Mee',
        )
        CheckIn.objects.create(
            id=0,
            author=User.objects.get(pk=0),
            duration=2,
            tag='code',
            activities='test runner',
        )
        CheckIn.objects.create(
            id=1,
            author=User.objects.get(pk=0),
            duration=1,
            tag='code',
            activities='deploy to Heroku',
        )

    def test_checkin_correct_string_output(self):
        checkin0 = str(CheckIn.objects.get(pk=0))
        checkin1 = str(CheckIn.objects.get(pk=1))
        self.assertEqual(checkin0, '2.0 hrs #code test runner')
        self.assertEqual(checkin1, '1.0 hr #code deploy to Heroku')
