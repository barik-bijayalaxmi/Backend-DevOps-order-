pipeline {
  agent any

  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t order-service .'
      }
    }

    stage('Push Image') {
      steps {
        echo 'Push image to AWS ECR'
      }
    }
  }
}
