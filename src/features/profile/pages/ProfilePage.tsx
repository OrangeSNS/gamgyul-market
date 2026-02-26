import { useState, useEffect } from 'react'
import { useBottomSheet } from '@shared/hooks/useBottomSheet'
import { useModal } from '@shared/hooks/useModal'
import { useParams, useNavigate } from 'react-router-dom'
import Avatar from '@shared/components/Avatar'
import Button from '@shared/components/Button'
import PostCard from '@shared/components/PostCard'
import ProductCard from '@shared/components/ProductCard'
import Spinner from '@shared/components/Spinner'
import Modal from '@shared/components/Modal'
import BottomSheet from '@shared/components/BottomSheet'
import TopBar from '@app/layouts/TopBar'
import { useAuth } from '@app/providers/AuthProvider'
import { User, Post, Product } from '@shared/types'
import { ROUTES } from '@shared/constants'
import { parsePostImages } from '@shared/utils'
import {
  getProfile,
  followUser,
  unfollowUser,
  getUserPosts,
  getProducts,
  deleteProduct,
} from '../api'

type ViewMode = 'list' | 'grid'

export default function ProfilePage() {
  const { accountName } = useParams<{ accountName: string }>()
  const navigate = useNavigate()
  const { user: me, logout } = useAuth()

  const isMe = me?.accountname === accountName

  const [profile, setProfile] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const profileSheet = useBottomSheet()
  const productSheet = useBottomSheet()
  const logoutModal = useModal()
  const deleteModal = useModal()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  useEffect(() => {
    if (!accountName) return
    setLoading(true)
    Promise.all([
      getProfile(accountName),
      getUserPosts(accountName),
      getProducts(accountName),
    ])
      .then(([{ profile }, { post }, { product }]) => {
        setProfile(profile)
        setPosts(post)
        setProducts(product)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [accountName])

  const handleFollowToggle = async () => {
    if (!profile) return
    try {
      if (profile.isfollow) {
        const { profile: updated } = await unfollowUser(profile.accountname)
        setProfile(updated)
      } else {
        const { profile: updated } = await followUser(profile.accountname)
        setProfile(updated)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleProductClick = (product: Product) => {
    if (!isMe) {
      window.open(product.link, '_blank')
      return
    }
    setSelectedProduct(product)
    productSheet.open()
  }

  const handleDeleteProduct = async () => {
    if (!deleteTarget) return
    try {
      await deleteProduct(deleteTarget)
    } catch (err) {
      console.error(err)
    }
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget))
    setDeleteTarget(null)
    deleteModal.close()
  }

  const albumPosts = posts.filter((p) => parsePostImages(p.image).length > 0)

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex justify-center py-20 text-sm text-gray-500">
        프로필을 찾을 수 없습니다.
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* ── 상단 바 ──────────────────────────────────────────── */}
      <TopBar
        showBack={!isMe}
        title=""
        rightSlot={
          <button
            onClick={profileSheet.open}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="더보기"
          >
            {/* 세로 3점 메뉴 */}
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-gray-700"
              fill="currentColor"
            >
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        }
      />

      {/* ── 프로필 헤더 ──────────────────────────────────────── */}
      <section className="px-6 pt-4 pb-6">
        {/* 팔로워 | 아바타 | 팔로잉 */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() =>
              navigate(ROUTES.PROFILE_FOLLOWERS(profile.accountname))
            }
            className="flex flex-col items-center gap-0.5 min-w-[72px]"
          >
            <span className="text-xl font-bold text-gray-900">
              {profile.followerCount.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400">followers</span>
          </button>

          <Avatar src={profile.image} alt={profile.username} size="xl" />

          <button
            onClick={() =>
              navigate(ROUTES.PROFILE_FOLLOWING(profile.accountname))
            }
            className="flex flex-col items-center gap-0.5 min-w-[72px]"
          >
            <span className="text-xl font-bold text-gray-900">
              {profile.followingCount.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400">followings</span>
          </button>
        </div>

        {/* 이름 · 계정 · 소개 */}
        <div className="text-center mb-5">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            {profile.username}
          </h2>
          <p className="text-sm text-gray-400 mb-2">@ {profile.accountname}</p>
          {profile.intro && (
            <p className="text-sm text-gray-500 leading-relaxed">
              {profile.intro}
            </p>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3 justify-center">
          {isMe ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(ROUTES.PROFILE_EDIT)}
              >
                프로필 수정
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(ROUTES.PRODUCT_NEW)}
              >
                상품 등록
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={profile.isfollow ? 'outline' : 'primary'}
                size="sm"
                onClick={handleFollowToggle}
              >
                {profile.isfollow ? '언팔로우' : '팔로우'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(ROUTES.CHAT_ROOM(profile.accountname))}
              >
                채팅하기
              </Button>
            </>
          )}
        </div>
      </section>

      {/* ── 판매 중인 상품 ────────────────────────────────────── */}
      {products.length > 0 && (
        <section className="border-t border-gray-200 py-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3 px-4">
            판매 중인 상품
          </h3>
          <div className="flex flex-nowrap gap-3 overflow-x-auto scrollbar-hide pl-4 pb-2">
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[140px]">
                <ProductCard
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              </div>
            ))}
            {/* 마지막 카드 뒤 오른쪽 여백 (padding-right 대체) */}
            <div className="flex-shrink-0 w-4" aria-hidden="true" />
          </div>
        </section>
      )}

      {/* ── 게시글 섹션 ────────────────────────────────────────── */}
      <div className="border-t border-gray-200">
        {/* 뷰 토글 (우측 정렬) */}
        <div className="flex justify-end px-2 border-b border-gray-200">
          <button
            onClick={() => setViewMode('list')}
            aria-label="리스트 보기"
            className={[
              'flex items-center justify-center p-3 border-b-2 transition-colors',
              viewMode === 'list'
                ? 'border-brand text-brand'
                : 'border-transparent text-gray-400',
            ].join(' ')}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            aria-label="앨범 보기"
            className={[
              'flex items-center justify-center p-3 border-b-2 transition-colors',
              viewMode === 'grid'
                ? 'border-brand text-brand'
                : 'border-transparent text-gray-400',
            ].join(' ')}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
        </div>

        {/* 리스트 뷰 */}
        {viewMode === 'list' ? (
          posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isMyPost={isMe}
                onDelete={(id) =>
                  setPosts((prev) => prev.filter((p) => p.id !== id))
                }
              />
            ))
          ) : (
            <p className="text-center text-sm text-gray-400 py-12">
              게시글이 없습니다.
            </p>
          )
        ) : albumPosts.length > 0 ? (
          /* 앨범 뷰 */
          <div className="grid grid-cols-3 gap-0.5">
            {albumPosts.map((post) => {
              const images = parsePostImages(post.image)
              return (
                <button
                  key={post.id}
                  onClick={() => navigate(ROUTES.POST_DETAIL(post.id))}
                  className="aspect-square overflow-hidden bg-gray-100"
                >
                  <img
                    src={images[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-400 py-12">
            이미지가 있는 게시글이 없습니다.
          </p>
        )}
      </div>

      {/* ── 프로필 바텀시트 ──────────────────────────────────── */}
      <BottomSheet
        open={profileSheet.isOpen}
        onClose={profileSheet.close}
        items={
          isMe
            ? [
                {
                  label: '설정 및 개인정보',
                  onClick: () => navigate(ROUTES.PROFILE_EDIT),
                },
                {
                  label: '로그아웃',
                  onClick: logoutModal.open,
                  danger: true,
                },
              ]
            : [{ label: '신고하기', onClick: () => {}, danger: true }]
        }
      />

      {/* ── 상품 바텀시트 ────────────────────────────────────── */}
      <BottomSheet
        open={productSheet.isOpen}
        onClose={productSheet.close}
        items={[
          {
            label: '삭제',
            danger: true,
            onClick: () => {
              setDeleteTarget(selectedProduct?.id ?? null)
              deleteModal.open()
            },
          },
          {
            label: '수정',
            onClick: () => {
              if (selectedProduct)
                navigate(ROUTES.PRODUCT_EDIT(selectedProduct.id))
            },
          },
          {
            label: '웹사이트에서 보기',
            onClick: () => {
              if (selectedProduct?.link)
                window.open(selectedProduct.link, '_blank')
            },
          },
        ]}
      />

      {/* ── 로그아웃 모달 ────────────────────────────────────── */}
      <Modal
        open={logoutModal.isOpen}
        message="로그아웃 하시겠어요?"
        confirmLabel="로그아웃"
        onConfirm={() => {
          logout()
          navigate(ROUTES.LOGIN, { replace: true })
        }}
        onCancel={logoutModal.close}
        destructive
      />

      {/* ── 상품 삭제 모달 ───────────────────────────────────── */}
      <Modal
        open={deleteModal.isOpen}
        message="상품을 삭제하시겠어요?"
        confirmLabel="삭제"
        onConfirm={handleDeleteProduct}
        onCancel={() => {
          deleteModal.close()
          setDeleteTarget(null)
        }}
        destructive
      />
    </div>
  )
}
