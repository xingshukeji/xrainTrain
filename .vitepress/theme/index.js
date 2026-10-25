import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import FlowSteps from './components/FlowSteps.vue'
import QuizCard from './components/QuizCard.vue'
import LearningRecord from './components/LearningRecord.vue'
import CourseProgress from './components/CourseProgress.vue'
import NoteLab from './components/NoteLab.vue'
import './style.css'
export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('FlowSteps', FlowSteps)
    app.component('QuizCard', QuizCard)
    app.component('LearningRecord', LearningRecord)
    app.component('CourseProgress', CourseProgress)
    app.component('NoteLab', NoteLab)
  }
}
