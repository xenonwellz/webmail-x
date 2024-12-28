/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const MailboxesController = () => import('#controllers/mailboxes_controller')
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/mailboxes', [MailboxesController, 'index'])
router.get('/mailboxes/:mailbox', [MailboxesController, 'show'])
router.get('/mailboxes/:mailbox/emails/:uid', [MailboxesController, 'showEmail'])
