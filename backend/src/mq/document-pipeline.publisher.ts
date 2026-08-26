import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DocumentEntity } from '../document/entities/document.entity';
import { RAG_REINDEX_EXCHANGE, RAG_RK_BY_IDS } from './mq.constants';
import { ReindexMessage } from './messages/pipeline.messages';
import { RabbitMqService } from './rabbitmq.service';

/**
 * 文档发布后的知识管线「生产者」
 *
 * <p>触发：RAG 向量化。</p>
 * <p>约定：投递失败只打日志，<b>不回滚</b>文档已发布状态。</p>
 */
@Injectable()
export class DocumentPipelinePublisher {
  private readonly logger = new Logger(DocumentPipelinePublisher.name);

  constructor(private readonly rabbit: RabbitMqService) {}

  /** 发布成功后调用：投递 RAG 分块向量化任务 */
  async afterPublish(document: DocumentEntity) {
    await this.triggerRagReindex(document.id);
  }

  /** RAG：按文档 ID 重建向量块 */
  private async triggerRagReindex(documentId: string) {
    const message: ReindexMessage = {
      taskId: randomUUID(), // 本次任务唯一编号
      type: 'BY_DOC_IDS', // 任务类型：按文档 ID 重建
      documentIds: [documentId], // 要处理的文档
    };
    const ok = await this.rabbit.publish(
      RAG_REINDEX_EXCHANGE, // 交换机：rag.reindex.exchange
      RAG_RK_BY_IDS, // 路由键：rag.reindex.by_ids
      message, // 消息体
    );
    this.logger.log(
      `RAG 重建索引${ok ? '已投递' : '投递失败'}：documentId=${documentId}, taskId=${message.taskId}`,
    );
  }
}
