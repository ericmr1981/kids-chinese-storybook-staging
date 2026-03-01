import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageShell } from '../components/PageShell';

function FeatureCard({
  icon,
  title,
  desc,
  iconBg,
}: {
  icon: string;
  title: string;
  desc: string;
  iconBg: string;
}) {
  return (
    <Card className="border-2 border-kid-border shadow-soft rounded-[28px]">
      <div className="p-7 text-center space-y-2">
        <div className={`mx-auto h-14 w-14 rounded-2xl flex items-center justify-center ${iconBg}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <h3 className="text-lg font-extrabold text-neutral-900">{title}</h3>
        <p className="text-sm text-neutral-600 leading-relaxed">{desc}</p>
      </div>
    </Card>
  );
}

export function HomePage() {
  return (
    <PageShell>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-5xl text-center space-y-10">
          {/* 顶部装饰 */}
          <div className="text-5xl">✨</div>

          {/* 标题 */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-kid-pink-500 to-kid-blue-500 bg-clip-text text-transparent">
              儿童中文学习
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-700 font-semibold">
            让识字变得像听故事一样有趣！
          </p>
          <p className="text-sm sm:text-base text-neutral-500">
            专为 3-6 岁幼儿园小朋友设计
          </p>

          {/* 主按钮区 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create">
              <Button variant="kidPink" size="lg" className="w-full sm:w-auto min-w-[160px]">
                开始学习
              </Button>
            </Link>
            <Link to="/library">
              <Button variant="kidBlue" size="lg" className="w-full sm:w-auto min-w-[160px]">
                学习中心
              </Button>
            </Link>
          </div>

          {/* 三张功能卡 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <FeatureCard
              icon="📖"
              title="AI 故事生成"
              desc="输入生字或关键词，AI 自动生成有趣的故事"
              iconBg="bg-kid-pink-500/15"
            />
            <FeatureCard
              icon="⚡️"
              title="智能配图"
              desc="根据故事内容生成精美插图"
              iconBg="bg-kid-blue-500/15"
            />
            <FeatureCard
              icon="⭐️"
              title="故事书架"
              desc="自动保存故事，随时回顾与管理"
              iconBg="bg-kid-yellow-500/20"
            />
          </div>

          {/* 底部 CTA */}
          <div className="pt-10 flex justify-center">
            <Card className="w-full max-w-2xl border-2 border-kid-border shadow-soft rounded-[28px]">
              <div className="p-8 text-center space-y-4">
                <div className="text-4xl">🌟</div>
                <h2 className="text-2xl font-extrabold text-neutral-900">
                  准备好开始冒险了吗？
                </h2>
                <p className="text-neutral-600">
                  和可爱的小伙伴一起，在故事中学会新汉字！
                </p>
                <div className="pt-2">
                  <Link to="/create">
                    <Button variant="kidPink" size="lg" className="w-full sm:w-[260px]">
                      进入学习中心
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
