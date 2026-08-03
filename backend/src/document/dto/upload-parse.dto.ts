import { IsBoolean, IsOptional, IsString } from 'class-validator';

/** 上传文件并解析为文档时附带的元数据 */
export class UploadParseDto {
  /** 分类 ID */
  @IsOptional()
  @IsString()
  categoryId?: string;

  /** 团队 ID */
  @IsOptional()
  @IsString()
  teamId?: string;

  /** 作者 ID */
  @IsOptional()
  @IsString()
  authorId?: string;

  /** 标签（逗号分隔） */
  @IsOptional()
  @IsString()
  tags?: string;

  /** 备注 */
  @IsOptional()
  @IsString()
  remark?: string;

  /** 是否公开 */
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  /** 创建人 ID */
  @IsOptional()
  @IsString()
  createBy?: string;
}
