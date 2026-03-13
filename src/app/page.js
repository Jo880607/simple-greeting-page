'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import TeamFilter from '@/components/TeamFilter'
import TeamMembersGrid from '@/components/TeamMembersGrid'
import MemberDetailModal from '@/components/MemberDetailModal'
import Footer from '@/components/Footer'

import { members } from '@/data/members'

export default function HomePage() {
  const [filteredMembers, setFilteredMembers] = useState(members)
  const [selectedMember, setSelectedMember] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('전체')
  const [searchQuery, setSearchQuery] = useState('')

  // 필터링 로직
  useEffect(() => {
    let filtered = members

    // 역할별 필터
    if (activeFilter !== '전체') {
      filtered = filtered.filter(member => member.role === activeFilter)
    }

    // 검색어 필터
    if (searchQuery.trim()) {
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredMembers(filtered)
  }, [activeFilter, searchQuery])

  const handleMemberClick = (member) => {
    setSelectedMember(member)
    setIsModalOpen(true)
  }

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
  }

  const handleSearchChange = (query) => {
    setSearchQuery(query)
  }

  return (
    <div className="min-h-screen bg-warm-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Team Section */}
        <motion.section 
          id="team"
          className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-warm-gray-900 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              우리 팀을 소개합니다
            </motion.h2>
            <motion.p 
              className="text-gray-600 text-lg max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              각자의 전문성을 바탕으로 따뜻하고 혁신적인 디지털 솔루션을 만들어갑니다
            </motion.p>
          </div>

          {/* 필터 & 검색 */}
          <TeamFilter 
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            membersCount={filteredMembers.length}
          />

          {/* 팀원 그리드 */}
          <TeamMembersGrid 
            members={filteredMembers}
            onMemberClick={handleMemberClick}
          />
        </motion.section>
      </main>

      <Footer />

      {/* 상세 모달 */}
      {isModalOpen && selectedMember && (
        <MemberDetailModal 
          member={selectedMember}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}