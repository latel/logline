pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        git(url: 'https://github.com/latel/logline', branch: 'master', changelog: true)
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
  }
}