/**
 * Production module federation config for shell app
 * Update the chart URL to match your Vercel deployment URL
 */
module.exports = {
  name: 'shell',
  remotes: [
    // Chart app deployed to Vercel
    ['chart', 'https://chart-mf-demo-3mvpukjuv-maor700s-projects.vercel.app/']
  ],
}; 