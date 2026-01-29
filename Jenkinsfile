pipeline {
  agent any

  stages {
    stage('Build Image') {
      steps {
        sh 'docker build -t todo-app:1.0 .'
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh 'kubectl apply -f k8s/'
      }
    }
  }
}
