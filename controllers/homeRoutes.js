const router = require('express').Router();
const { Post, User, Comments } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
      // Get all projects and JOIN with user data
      const postData = await Post.findAll({
        include: [
          {
            model: User,
            attributes: ['userName'],
          },
        ],
      });
      console.log(postData);
  
      // Serialize data so the template can read it
      const posts = postData.map((post) => post.get({ plain: true }));
  console.log(posts)
      // Pass serialized data and session flag into template
      res.render('homepage', { 
        posts, 
        logged_in: req.session.logged_in 
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/homepage', async (req, res) => {
    try {
      // Get all projects and JOIN with user data
      const postData = await Post.findAll({
        include: [
          {
            model: User,
            attributes: ['userName'],
          },
        ],
      });
  
      // Serialize data so the template can read it
      const posts = postData.map((post) => post.get({ plain: true }));
  
      // Pass serialized data and session flag into template
      res.render('homepage', { 
        posts, 
        logged_in: req.session.logged_in 
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/post/:id', async (req, res) => {
    try {
      const postData = await Post.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['userName'],
          },
          {
            model: Comments,
            attributes: ['comment', 'user_id', 'date_created'],
            include: [{model: User, attributes: ['userName']}]
          }
        ],
      });
  
      const post = postData.get({ plain: true });
  
      res.render('single-post', {
        ...post,
        logged_in: req.session.logged_in
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
    try {
      // Find the logged in user based on the session ID
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [
            { model: Post }, 
            {model: Comments}
        ],
      });
  
      const user = userData.get({ plain: true });
  
      res.render('dashboard', {
        ...user,
        logged_in: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/dashboard');
      return;
    }
  
    res.render('login');
  });

  router.get('/signup', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/dashboard');
      return;
    }
  
    res.render('signup');
  });

  router.get('/create-post', withAuth, async (req, res) => {
    res.render('create-post', {
      logged_in: req.session.logged_in
    });
  });
  

  
router.get('/edit-post/:id',  async (req, res) => {
  try {
      // Get one post, don't need to include anything with it.
      const postData = await Post.findByPk(req.params.id, {});

      const post = postData.get({ plain: true });

      res.render('edit-post', {
          ...post,
          logged_in: req.session.logged_in
      });
  } catch (err) {
      res.status(500).json(err);
  }
});


  module.exports = router;