import { useDocumentTitle } from '../hooks/useDocumentTitle'
export default function PrivacyPolicy() {
    useDocumentTitle('隐私政策')

  return (
    <div className="px-6 md:px-12 lg:px-20 pt-12 pb-20">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← 返回上一页
          </button>
        </div>

        <div className="glass-card p-8 md:p-10">
          <h1 className="font-display text-3xl md:text-4xl text-gray-800 dark:text-gray-100 mb-2">隐私政策</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-8">最后更新：2026 年 7 月 1 日</p>

          <div className="space-y-8 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {/* Section 1 */}
            <section>
              <h2 className="font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">一、概述</h2>
              <p>
                心晴驿站 MindEase（以下简称"本站"）非常重视您的隐私保护。本隐私政策旨在向您说明
                本站如何处理您的信息，帮助您了解在使用本站服务期间，我们收集哪些信息、如何使用这些信息，
                以及您享有哪些权利。
              </p>
              <p className="mt-2">
                本站是一个面向学生和年轻群体的心理健康科普工具网站，托管于 GitHub Pages。
                我们提供的所有功能（心理科普文章、情绪自评工具、放松练习、情绪日记、树洞倾诉、放松游戏等）
                均为免费公益性质。
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">二、信息收集范围</h2>
              <div className="space-y-3">
                <div className="p-4 bg-lavender-50/50 dark:bg-lavender-950/30 rounded-2xl">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">我们不主动收集的信息</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-500">
                    <li>本站<strong>不使用</strong>任何第三方数据追踪工具（如 Google Analytics、百度统计等）</li>
                    <li>本站<strong>不设置</strong>追踪 Cookie 或广告标识</li>
                    <li>本站<strong>不收集</strong>您的 IP 地址、地理位置、设备信息</li>
                    <li>本站<strong>不设置</strong>任何埋点或行为分析脚本</li>
                  </ul>
                </div>
                <div className="p-4 bg-peach-50/50 dark:bg-peach-950/30 rounded-2xl">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">用户主动提供的信息</h3>
                  <p className="text-gray-500 dark:text-gray-400">如果您选择使用以下功能，部分信息将保存在您的<strong>浏览器本地存储（localStorage）</strong>中：</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-500 dark:text-gray-400 mt-2">
                    <li><strong>注册/登录信息</strong>：昵称、邮箱、头像选择、个人简介</li>
                    <li><strong>情绪日记</strong>：心情记录、标签、笔记内容</li>
                    <li><strong>树洞留言</strong>：留言内容（匿名发布）</li>
                    <li><strong>测评记录</strong>：测评得分、测评类型、完成时间</li>
                    <li><strong>游戏成绩</strong>：舒尔特方格完成时间和昵称</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">三、数据存储方式</h2>
              <div className="p-4 bg-mint-50/50 dark:bg-mint-950/30 rounded-2xl">
                <p className="text-gray-600">
                  本站所有用户数据均存储在<strong>您的浏览器本地（localStorage）</strong>中，
                  <strong>不会上传至任何服务器或云存储</strong>。这意味着：
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-500 mt-2">
                  <li>数据仅存在于您当前使用的设备和浏览器中</li>
                  <li>清除浏览器数据会删除所有本地存储的信息</li>
                  <li>更换浏览器或设备后无法自动同步数据</li>
                  <li>网站运营者无法查看、访问或恢复您本地的个人数据</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">四、数据使用目的</h2>
              <p>您主动提供的信息仅用于以下目的：</p>
              <ul className="list-disc list-inside space-y-1 text-gray-500 mt-2">
                <li>为您提供情绪记录、测评历史、游戏排行等功能的正常运行</li>
                <li>在您的设备上显示您的个人资料和偏好设置</li>
                <li>本站不会将您的任何信息用于商业推广、广告投放或共享给第三方</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">五、数据安全</h2>
              <p>
                由于所有数据均存储在您的浏览器本地，本站不传输、不存储任何用户数据到服务器。
                但请注意以下安全事项：
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-500 mt-2">
                <li>与他人共用设备时，请及时清除浏览器数据以保护隐私</li>
                <li>在公共电脑上使用后，建议清除浏览器的本地存储</li>
                <li>树洞功能中的留言虽然匿名，但仍建议不要透露个人身份信息</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">六、第三方服务</h2>
              <p>本站当前使用的第三方资源仅限于：</p>
              <ul className="list-disc list-inside space-y-1 text-gray-500 mt-2">
                <li><strong>GitHub Pages</strong>：网站静态文件托管服务</li>
                <li><strong>CDN 资源</strong>：可能使用公共 CDN 加载前端框架（Tailwind CSS 等）</li>
              </ul>
              <p className="mt-2">
                以上服务均为基础技术组件，不涉及用户个人数据的收集与处理。
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">七、免责声明</h2>
              <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl text-amber-700 dark:text-amber-400">
                <ul className="list-disc list-inside space-y-1">
                  <li>本站所有内容（包括文章、测评、放松工具等）仅供心理健康科普和日常自我觉察参考</li>
                  <li>本站<strong>不提供</strong>心理咨询、诊断或治疗服务</li>
                  <li>本站测评基于简化版心理量表，结果<strong>不具备临床诊断效力</strong></li>
                  <li>本站内容参考心理学研究文献和公开资料，但不保证内容的绝对准确性和完整性</li>
                  <li>如遇严重心理困扰，请前往正规医院心理科/精神科就诊或拨打心理援助热线</li>
                </ul>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">八、未成年人保护</h2>
              <p>
                本站面向学生和年轻群体，我们特别关注未成年人保护。我们不会主动收集未成年人的个人信息。
                如果您是未满 18 周岁的未成年人，请在监护人的指导下使用本站。
                如发现任何违反未成年人保护的内容，请通过 GitHub Issues 联系我们。
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">九、您的权利</h2>
              <p>由于所有数据存储在您的浏览器本地，您可以随时：</p>
              <ul className="list-disc list-inside space-y-1 text-gray-500 mt-2">
                <li>在浏览器设置中清除 localStorage，删除所有本地数据</li>
                <li>在个人中心页面管理或删除自己的账户信息</li>
                <li>在测评历史、情绪日记等功能中删除单条或全部记录</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">十、政策更新</h2>
              <p>
                本隐私政策可能会不定期更新。更新后的政策将在本页面发布，并更新"最后更新"日期。
                建议您定期查看本页面以了解最新的隐私保护措施。
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">十一、联系我们</h2>
              <p>
                如您对本隐私政策有任何疑问或建议，欢迎通过以下方式联系我们：
              </p>
              <ul className="list-none space-y-1 text-gray-500 mt-2">
                <li>GitHub 仓库：<a href="https://github.com/caiaiji/mind-ease" target="_blank" rel="noopener noreferrer" className="text-lavender-500 dark:text-lavender-400 hover:text-lavender-600 dark:hover:text-lavender-300">github.com/caiaiji/mind-ease</a></li>
                <li>通过 GitHub Issues 提交问题或反馈</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
