import { useEffect, useState, useRef } from "react";
import ProgressBar from "./ProgressBar";
import DonationStatistics from "./DonationStatistics";
import donationWidgetConfig from "../../config/donationWidgetConfig";

export default function DonationWidget({ data, error }) {
  const ref = useRef(null);

  const { scaleClass, showCenter } = donationWidgetConfig;

  useEffect(() => {
    if (!ref.current) return;

    // 计算百分比（例如 0.26 → "26%"）
    const percent = Math.min(100, Math.round((data.raised / data.goal) * 100));
    // 设置闪光动画终点位置
    ref.current.style.setProperty("--target", percent + "%");

    // 允许你自定义动画时长（可选）
    ref.current.style.setProperty("--time", "2s");

    // 移除 animate（重置动画）
    ref.current.classList.remove("animate");

    // 强制浏览器重绘 → 让动画可重新触发
    void ref.current.offsetWidth;

    // 添加 animate → 开始动画
    ref.current.classList.add("animate");
  }, [data.raised]);

  return (
    //这边有碰到过组件在页面比较小的问题：因为收缩的是 里面那个 <section>（flex item），不是外面的 <div.App>,<section>：作为 flex item，默认 flex: 0 1 auto
    // → 宽度 = 内容多宽就多宽（shrink-wrap）你在 <section> 里面再写 w-full，只是 占满 section 那一点点宽度，不会撑满整个屏幕。
    <section
      aria-label='Donation-progress'
      className='w-full  flex justify-center'
    >
      <div
        className={
          "container px-4 sm:px-0  max-w-xl mx-auto w-full " + scaleClass
        }
      >
        <ProgressBar data={data} error={error} ref={ref} />
        <DonationStatistics data={data} error={error} />
      </div>
    </section>
  );
}
